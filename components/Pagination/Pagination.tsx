import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  forcePage?: number;
  onPageChange: (selected: number) => void;
}

export default function PaginationComp({
  pageCount,
  forcePage = 0,
  onPageChange,
}: PaginationProps) {
  return (
    <div className={css.wrap}>
      <ReactPaginate
        breakLabel="..."
        nextLabel="→"
        previousLabel="←"
        pageCount={pageCount}
        onPageChange={({ selected }) => onPageChange(selected)}
        forcePage={forcePage}
        containerClassName={css.pagination}
        activeClassName={css.active}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
      />
    </div>
  );
}
