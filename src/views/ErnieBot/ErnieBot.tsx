import "./ErnieBot.scss";
import WujieReact from "@/components/WujieReact";

export default function ErnieBot() {
  // const timestamp = new Date().getTime();
  const chatUrl = import.meta.env.DEV
    ? "http://localhost:5174/"
    : `${window.location.origin}/chat/`;

  return (
    <div className="erniebot_container">
      <WujieReact
        name="chat"
        url={chatUrl}
        width="100%"
        height="100%"
        sync={false}
      />
    </div>
  );
}
