class Player_User {
    constructor(config) {
        this.config = config; //this.config.limit = maximum time limit for user input = 0 no time limit
        // this.config.maxDepth = maximum depth for user input = 0 no limit

        this.searchStartTime = 0; // time when search started

        // Iterative Deepening ALpha-Beta Search settings
        this.bestAction = null; // best action found so far
        this.currentBestAction = null; // current best action
        this.currentMaxDepth = null; // current max depth of search
        this.maxPlayer = null; // mcurrent maximizing player   for minimax

        let str = "Student AB Player\n";

        str += " Time Limit: " + this.config.limit + " \n";
        str += " Max Depth: " + this.config.maxDepth + " \n";
        console.log(str);

        //create Zobrist random value tables here for optimization
    }

    getAction(state) {
       return this.IDAlphaBeta(state);
    }

    // here we implement the Iterative Deepening Alpha-Beta Search
    // we use this.config.limit to limit the time of the search
    // and this.config.maxDepth to limit the depth of the search
    // one will always be greater than 0
    // return best completed action from last completed search
    // ARgs: state - state to find the best action for player to move
    // returns: best action for player to move
    IDAlphaBeta(state) {
        // record of time
        this.searchStartTime = performance.now();

        // return best action 
        return 0;
    }

    // here we implement the min max search with alpha-beta pruning
    // make sure to copy states via state.copy() before generating children othewise modification of references of state will occur on different levels of recursion
    // ARgs:
    // state - state of current node of search tree
    // alpha(int) : current alpha value
    // beta(int) : current beta value
    // depth(int) : current depth of search
    // max(bool) : whether the player is maximizing or not

    // returns: 
    // value(ibt) : value of the state for the player to move 
    AlphaBeta(state, alpha, beta, depth, max) {
        // perform time check
        let elapsedTime = performance.now() - this.searchStartTime;

        return 0;
    }

    
}