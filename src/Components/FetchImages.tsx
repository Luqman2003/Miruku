interface FetchDataProps {
  imageUrl?: string;
}

const FetchAndDisplayImage: React.FC<FetchDataProps> = ({ imageUrl }) => {
  if (!imageUrl) return <div>No image available</div>;

  return (
      <img src={imageUrl} alt="Anime Image" className="aImg"/>
  );
};

export default FetchAndDisplayImage;