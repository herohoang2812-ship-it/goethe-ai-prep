export function balanceAnswerPositions(groups) {
  groups.forEach((group, groupIndex) => {
    const questions = group.questions || group.quiz || [];
    questions.forEach((question, questionIndex) => {
      const count = question.options.length;
      const shift = (groupIndex + questionIndex) % count;
      question.options = [...question.options.slice(shift), ...question.options.slice(0, shift)];
      question.correct = (question.correct - shift + count) % count;
    });
  });
  return groups;
}