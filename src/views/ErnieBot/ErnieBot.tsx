import "./ErnieBot.scss";
import WujieReact from "@/components/WujieReact";

export default function ErnieBot() {
  // const timestamp = new Date().getTime();
  const getChatUrl = () => {
    const mode = import.meta.env.MODE;

    const urlMap: Record<string, string> = {
      development: "http://localhost:5174/",
      test: "https://baobaojs.com/chat/",
      production: "https://baobaojs.com/chat/",
    };

    return urlMap[mode] || urlMap.development;
  };
  return (
    <div className="erniebot_container">
      <WujieReact
        name="chat"
        url={getChatUrl()}
        width="100%"
        height="100%"
        sync={false}
      />
    </div>
  );
}
