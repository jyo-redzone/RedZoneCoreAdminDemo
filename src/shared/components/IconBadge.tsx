import { Badge, BadgeProps } from '@mui/material';

interface IconBadgeProps extends Omit<BadgeProps, 'badgeContent'> {
  count: number;
}

export const IconBadge = ({ count, children, ...props }: IconBadgeProps) => {
  if (count === 0) {
    return <>{children}</>;
  }

  return (
    <Badge badgeContent={count} color="primary" {...props}>
      {children}
    </Badge>
  );
};
