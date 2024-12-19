interface SettingsTemplateProps {
  children: React.ReactNode;
  title: string;
}

export const SettingsTemplate = ({
  children,
  title,
}: SettingsTemplateProps) => {
  return (
    <div className="dark-bg-primary flex min-h-full w-full flex-col gap-8 overflow-y-auto rounded-l-2xl p-6 pb-12 shadow-lg transition-colors duration-300 dark:rounded-l-lg">
      <h1 className="dark-text-title border-b border-zinc-700 pb-4 text-4xl font-semibold dark:border-zinc-300">
        {title}
      </h1>

      {children}
    </div>
  );
};
