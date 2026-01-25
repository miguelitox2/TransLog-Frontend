interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = (HeaderProps: HeaderProps) => {
  return (
    <header className="text-slate-50">
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="text-xl font-bold">{HeaderProps.title}</h1>
          <span className="text-sm">{HeaderProps.subtitle}</span>
        </div>
      </div>

      <div className="border w-full border-slate-700 mb-6"></div>
    </header>
  );
};
