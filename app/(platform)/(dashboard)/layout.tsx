import Navbar from "./_components/navbar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default DashBoardLayout;
