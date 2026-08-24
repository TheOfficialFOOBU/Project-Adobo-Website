/**
 * Recruitment status — src/data/recruitment.json so officers can flip
 * openings without touching TypeScript. Rendered as a dismissible banner
 * under the fixed site header while `open` is true.
 */
import rawRecruitment from '@/data/recruitment.json';

export interface RecruitmentConfig {
  open: boolean;
  seeking: string[];
  note: string;
}

export const RECRUITMENT: RecruitmentConfig = rawRecruitment;
