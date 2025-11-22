import Header from "../components/layout/HeaderLayout";
import MainContent from "./MainContent";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <MainContent />
    </div>
  );
}
