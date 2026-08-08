(() => {
  const list = document.querySelector("[data-microblog-list]");
  const pagination = document.querySelector("[data-microblog-pagination]");
  if (!list || !pagination) return;

  const entries = Array.from(list.querySelectorAll("[data-microblog-entry]"));
  const pageSize = Number.parseInt(pagination.dataset.pageSize || "20", 10);
  const totalPages = Math.ceil(entries.length / pageSize);
  if (!Number.isFinite(pageSize) || pageSize < 1 || totalPages < 2) return;

  const previous = pagination.querySelector("[data-page-previous]");
  const next = pagination.querySelector("[data-page-next]");
  const status = pagination.querySelector("[data-page-status]");
  if (!(previous instanceof HTMLButtonElement) || !(next instanceof HTMLButtonElement) || !status) {
    return;
  }

  const pageFromUrl = () => {
    const requested = Number.parseInt(new URL(window.location.href).searchParams.get("page") || "1", 10);
    return Number.isFinite(requested) ? Math.min(Math.max(requested, 1), totalPages) : 1;
  };

  let currentPage = pageFromUrl();

  const render = (page, updateUrl) => {
    currentPage = Math.min(Math.max(page, 1), totalPages);
    const first = (currentPage - 1) * pageSize;
    const last = first + pageSize;

    entries.forEach((entry, index) => {
      entry.hidden = index < first || index >= last;
    });

    previous.disabled = currentPage === 1;
    next.disabled = currentPage === totalPages;
    status.textContent = `Page ${currentPage} of ${totalPages}`;
    pagination.hidden = false;

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (currentPage === 1) url.searchParams.delete("page");
      else url.searchParams.set("page", String(currentPage));
      window.history.pushState({ page: currentPage }, "", url);
      list.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  previous.addEventListener("click", () => render(currentPage - 1, true));
  next.addEventListener("click", () => render(currentPage + 1, true));
  window.addEventListener("popstate", () => render(pageFromUrl(), false));
  render(currentPage, false);
})();
