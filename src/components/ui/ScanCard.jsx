import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

const ScanCard = ({
  title,
  description,
  icon,
  status,
  actionLabel = "Scan Now",
  onClick,
  className,
  children
}) => {
  return (
    <Card className={cn("scan-card shadow-sm", className)}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-lg bg-primary/8 text-primary">
              {icon}
            </span>
            <CardTitle className="text-xl font-medium">{title}</CardTitle>
          </div>
          {status && <StatusBadge status={status} />}
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="pt-0">
        <Button onClick={onClick} className="w-full">{actionLabel}</Button>
      </CardFooter>
    </Card>
  );
};

export default ScanCard;
