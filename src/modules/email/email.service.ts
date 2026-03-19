import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { TypedConfigService } from "src/config/typed-config.service";

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private readonly configService: TypedConfigService) {
    this.resend = new Resend(this.configService.get("RESEND_API_KEY"));
  }

  async sendContributorInvite(
    contributorEmail: string,
    token: string,
    expiresAt: Date,
  ) {
    const { data, error } = await this.resend.emails.send({
      from: "MapLocale <noreply.maplocale@theridwanade.me>",
      to: contributorEmail,
      subject: "You have been invited to contribute to MapLocale",
      html: `
      <p>You have been invited to contribute to MapLocale.</p>
      <p>Click <a href="${this.configService.get("MAPLOCALE_URL")}/invite/${token}">here</a> to accept the invitation.</p>
      <p>This invitation will expire at ${expiresAt.toLocaleString()}.</p>
      `,
    });

    if (error) {
      console.error(error);
    }

    return data;
  }
}
