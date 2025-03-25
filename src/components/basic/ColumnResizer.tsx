const ColumnResizer = ({ header }: { header: any }) => {
  if (header.column.getCanResize() === false) return <></>;

  return (
    <div
      {...{
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className: `absolute top-0 right-0 cursor-col-resize w-px h-full border border-dashed`,
        style: {
          userSelect: "none",
          touchAction: "none",
        },
      }}
    />
  );
};

export default ColumnResizer;
