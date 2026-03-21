import type { QuizQuestion } from "@/types/quiz";
import {
  isMultipleChoiceQuestion,
  isTrueFalseQuestion,
  isImageGuessQuestion,
  isQuoteQuestion,
  isPersonalityQuestion,
  isOrderQuestion,
} from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import ImageGuessQuestion from "./ImageGuessQuestion";
import QuoteQuestion from "./QuoteQuestion";
import PersonalityQuestion from "./PersonalityQuestion";
import OrderQuestion from "./OrderQuestion";

/**
 * Renders the appropriate question UI based on question.type.
 * Add new question types here and in the QuizQuestion union in @/types/quiz.
 */
export function QuizQuestionRenderer(props: QuizQuestionRendererProps) {
  const { question } = props;

  switch (question.type) {
    case "multiple-choice":
      return isMultipleChoiceQuestion(question) ? (
        <MultipleChoiceQuestion {...props} question={question} />
      ) : null;
    case "true-false":
      return isTrueFalseQuestion(question) ? (
        <TrueFalseQuestion {...props} question={question} />
      ) : null;
    case "image-guess":
      return isImageGuessQuestion(question) ? (
        <ImageGuessQuestion {...props} question={question} />
      ) : null;
    case "quote":
      return isQuoteQuestion(question) ? (
        <QuoteQuestion {...props} question={question} />
      ) : null;
    case "personality":
      return isPersonalityQuestion(question) ? (
        <PersonalityQuestion {...props} question={question} />
      ) : null;
    case "order":
      return isOrderQuestion(question) ? (
        <OrderQuestion {...props} question={question} />
      ) : null;
    default: {
      const _exhaustive: never = question;
      return null;
    }
  }
}

export default QuizQuestionRenderer;
