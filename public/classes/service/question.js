class Question {
  constructor({ questionTxt, range, values }) {
    if (range.length !== values.length) {
      throw new Error("Length of range must match length of values.");
    }

    this.questionTxt = questionTxt;
    this.range = range;
    this.values = values;
  }

  static fromJson({ json }) {
    return new Question({
      questionTxt: json[Question.sQuestionTxt],
      range: json[Question.sRange],
      values: json[Question.sValues],
    });
  }

  toJson() {
    return {
      [Question.sQuestionTxt]: this.questionTxt,
      [Question.sRange]: this.range,
      [Question.sValues]: this.values,
    };
  }

  toString() {
    return `Question{
        ${Question.sQuestionTxt}: ${this.questionTxt},
        ${Question.sRange}: ${this.range},
        ${Question.sValues}: ${this.values},
        }`;
  }

  static sQuestionTxt = "questionTxt";
  static sRange = "range";
  static sValues = "values";
}

export default Question;
