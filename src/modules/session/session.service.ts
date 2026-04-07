import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSessionDto } from "./dto/CreateSession.dto";
import { IngestSessionDto, RawPointDto } from "./dto/InjestSession.dto";

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  createSession(dto: CreateSessionDto, userId: string) {
    const session = this.prisma.mappingSession.create({
      data: {
        userId: userId,
        name: dto.name,
        mappingMode: dto.mappingMode,
      },
    });

    return session;
  }

  // session.service.ts
  private cleanPoints(points: RawPointDto[]): [number, number][] {
    const MAX_ACCURACY_METERS = 50;
    const MAX_SPEED_MS = 30; // ~108 km/h, reasonable for driving

    const filtered = points.filter((p) => p.accuracy <= MAX_ACCURACY_METERS);

    const deduped = filtered.filter((p, i) => {
      if (i === 0) return true;
      const prev = filtered[i - 1];
      return p.latitude !== prev.latitude || p.longitude !== prev.longitude;
    });

    const outlierRemoved = deduped.filter((p, i) => {
      if (i === 0) return true;
      const prev = deduped[i - 1];
      const dt = (p.timestamp - prev.timestamp) / 1000; // seconds
      if (dt <= 0) return false;

      const dLat = p.latitude - prev.latitude;
      const dLon = p.longitude - prev.longitude;
      const distDeg = Math.sqrt(dLat ** 2 + dLon ** 2);
      const distMeters = distDeg * 111_000;
      const speed = distMeters / dt;

      return speed <= MAX_SPEED_MS;
    });

    return outlierRemoved.map((p) => [p.longitude, p.latitude]);
  }

  async ingestSession(
    sessionId: string,
    dto: IngestSessionDto,
    userId: string,
  ) {
    const coordinates = this.cleanPoints(dto.points);

    if (coordinates.length < 2) {
      throw new BadRequestException(
        "Insufficient valid GPS points after cleaning.",
      );
    }

    const rawTrack = { type: "LineString", coordinates };
    const MIN_TRACK_LENGTH_METERS = 20;

    const isValid =
      coordinates.length >= 2 &&
      this.estimateTrackLength(coordinates) >= MIN_TRACK_LENGTH_METERS;
    await this.prisma.mappingSession.update({
      where: { id: sessionId, userId },
      data: {
        rawTrack: JSON.parse(JSON.stringify(rawTrack)),
        status: "COMPLETED",
        endedAt: new Date(),
        isValid,
      },
    });

    await this.prisma.$executeRaw`
      UPDATE mapping_sessions
      SET cleaned_track = ST_GeomFromGeoJSON(${JSON.stringify(rawTrack)})
      WHERE id = ${sessionId}
        AND user_id = ${userId}
    `;

    return this.prisma.mappingSession.findUnique({
      where: { id: sessionId },
    });
  }

  private estimateTrackLength(coordinates: [number, number][]): number {
    let total = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2] = coordinates[i];
      const dLat = (lat2 - lat1) * 111_000;
      const dLon = (lon2 - lon1) * 111_000 * Math.cos((lat1 * Math.PI) / 180);
      total += Math.sqrt(dLat ** 2 + dLon ** 2);
    }
    return total;
  }
}
