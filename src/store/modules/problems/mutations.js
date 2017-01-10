export const setProblem = (state, problem) => {
    let id = problem.id;

    state.problems[id] = problem;
};

export const setTestCases = (state, payload) => {
    let id = payload.id;

    state.test_cases[id] = payload.testCases;
};
