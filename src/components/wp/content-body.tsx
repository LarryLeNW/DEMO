import { replaceBrandText } from "@/lib/brand";

type ContentBodyProps = {
  html: string;
};

export function ContentBody({ html }: ContentBodyProps) {
  return (
    <div
      className="wp-content"
      dangerouslySetInnerHTML={{ __html: replaceBrandText(html) }}
    />
  );
}
