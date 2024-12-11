import PageLayout from "@/app/_components/layouts/PageLayout";
import ShowLayoutHeader from "@/app/_components/show/ShowLayoutHeader";
import ShowLayoutTabs from "@/app/_components/show/ShowLayoutTabs";

type Props = {
  headerProps: React.ComponentProps<typeof ShowLayoutHeader>;
  tabsProps: React.ComponentProps<typeof ShowLayoutTabs>;
  children?: React.ReactNode;
};

/**
 * All ShowLayouts are a typical PageLayout with:
 *  * a specific look
 *  * a header
 *  * tabs
 */
export default function ShowLayout({ headerProps, ...props }: Props) {
  return (
    <PageLayout
      {...props}
      header={<ShowLayoutHeader {...headerProps} />}
      content={
        <ShowLayoutTabs {...props.tabsProps}>{props.children}</ShowLayoutTabs>
      }
    />
  );
}
