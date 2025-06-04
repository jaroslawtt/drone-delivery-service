const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full max-h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
};

export default AdminLayout;
