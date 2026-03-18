interface QuestionMediaProps {
  image?: string;
}

const QuestionMedia = ({ image }: QuestionMediaProps) => {
  if (!image) return null;

  return (
    <div className="flex justify-center mb-5">
      <img
        src={image}
        alt="Question illustration"
        className="w-20 h-20 rounded-lg object-cover border border-border/30"
        loading="lazy"
      />
    </div>
  );
};

export default QuestionMedia;
