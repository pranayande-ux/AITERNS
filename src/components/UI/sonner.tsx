import { useTheme } from "next-themes";
import { Toaster as SonnerComponent, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerComponent>;

export default function Sonner(props: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <SonnerComponent
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { toast };
