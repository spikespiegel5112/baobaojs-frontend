import "./ErnieBot.scss";

export default function ErnieBot() {
  const timestamp = new Date().getTime();

  return (
    <div className="erniebot_container">
      <iframe
        title="ErnieBot"
        src={`https://baobaojs.com/chat?iframe=${timestamp}`}
      ></iframe>
    </div>
  );
}
