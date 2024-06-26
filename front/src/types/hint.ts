export interface Answer {
  hintId: number;
  hintContent: string;
  hintStatusAnswer: string;
}
export type Hint = {
  hintId: number;
  hintContent: string;
};

export type AnswerInput = {
  hintId: number;
  hintStatusAnswer: string;
};
