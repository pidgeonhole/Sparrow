export const getCategories = state => {
    return state.categories;  // returns everything
};

export const getCategoriesOnly = state => {
    // return categories without the problem

    let bomb = [];

    state.categories.forEach(({id, name, description}) => {
        bomb.push({
            id,
            name,
            description
        })
    });

    return bomb;
};