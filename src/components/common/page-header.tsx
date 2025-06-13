interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className={`mb-8 text-center `}>
      <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>{title}</h1>
      {description && <p className='mt-2 text-lg text-muted-foreground'>{description}</p>}
    </div>
  );
}
