export default function BookshelfLoading() {
  return (
    <div className="body">
      <div className="bookshelf_wraper relative top-[60%] left-[50%] ">
        <ul className="book_list w-[300px] p-0 my-0 mx-auto ">
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items origin-bottom-left transform translate-x-[300px] first "></li>
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items  origin-bottom-left transform translate-x-[300px] second "></li>
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items origin-bottom-left transform translate-x-[300px] third"></li>
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items origin-bottom-left transform translate-x-[300px] fourth"></li>
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items  origin-bottom-left transform translate-x-[300px] fifth"></li>
          <li className="absolute top-[-120px] w-[40px] h-[120px]  opacity-0 bg-[#918ca9] book-items  origin-bottom-left transform translate-x-[300px] sixth"></li>
        </ul>
        <div className="shelf"></div>
      </div>
    </div>
  );
}
