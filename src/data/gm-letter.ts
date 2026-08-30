/**
 * Guild Master's Letter — intentionally empty by default.
 *
 * The component (GuildMasterLetter) renders nothing when `body` is empty
 * rather than fabricate content. Officers should populate the fields below
 * when an actual letter exists.
 */

export interface GuildMasterSignature {
  name: string;
  signedOn?: string;
  headline: string;
  body: string;
}

export const signature: GuildMasterSignature = {
  name: 'FOOBU',
  signedOn: '',
  headline: 'From the Adobo archives',
  body: '',
};
