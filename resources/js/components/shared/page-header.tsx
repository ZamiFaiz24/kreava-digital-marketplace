interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="border-border bg-card border-b py-5 sm:py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                        {description && <p className="text-muted-foreground mt-1 max-w-3xl text-sm sm:text-base">{description}</p>}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            </div>
        </div>
    );
}
