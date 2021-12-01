import getQueryString from './getQueryString';

async function getAllPosts(params) {
  const { limit = 5, page = 1, sort = {}, columnFilters = {}} = (params || {});

  const preparePostsData = (list = []) => {
    return list.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      body: item.body
    }));
  };

  let response;

  try {
    response = await fetch(`https://jsonplaceholder.typicode.com/comments?${getQueryString({
      limit,
      page,
      sort,
      columnFilters,
    })}`);

    response = await response.json();
  } catch (error) {
    throw error;
  }

  return preparePostsData(response || []);
}

function sortList(list, sort) {
  const sortFunction = (a, b) => {
    const sortFns = {
      asc: (a, b) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      },
      desc: (a, b) => {
        if (a < b) {
          return 1;
        } else if (a > b) {
          return -1;
        }
        return 0;
      },
    };

    let value = 0;

    return Object.entries(sort).some(([columnId, sortParam]) => {
      return value = sortFns[sortParam.type](a[columnId], b[columnId]);
    }) && value;
  };

  return (!sort || !Object.keys(sort)?.length)
    ? list
    : list?.sort?.(sortFunction) || list;
}

function filterList(list, columnFilters) {
  return list.filter((item) => Object.keys(columnFilters).every(
    (column) => String(item[column]).toLowerCase().startsWith(String(columnFilters[column]).toLowerCase())
  ));
}

function getPaginated(list, page, limit = 5) {
  if (limit === 'all') {
    return {
      data: list,
    };
  }

  const rightLimit = limit < 1 ? 1 : limit;

  let firstCurrentIndex = (page - 1) * limit;

  if (firstCurrentIndex < 0) {
    firstCurrentIndex = 0;
  }

  let lastCurrentIndex = page * limit - 1;

  if (lastCurrentIndex > list?.length - 1) {
    lastCurrentIndex = list?.length - 1;
  }

  const result = list?.length < rightLimit ? list : list.slice(firstCurrentIndex, lastCurrentIndex + 1);
  const totalPage = Math.ceil(list?.length / limit);

  return {
    data: result,
    pagination: {
      limit: rightLimit,
      totalPage,
      currentPage: page,
    },
  };
}

async function getPosts(params) {
  const { limit = 5, page = 1, sort = {}, columnFilters = {} } = (params || {});

  let result;

  try {
    // посылаю запрос каждый раз, чтобы приблизить к реальности,
    // и параметры туда отправляются для реалистичности
    const list = await getAllPosts(params);

    result = getPaginated(
      filterList(sortList(list, sort), columnFilters),
      page,
      limit,
    );
  } catch(error) {
    throw error;
  }

  return result;
}

export default {
  getPosts,
};
