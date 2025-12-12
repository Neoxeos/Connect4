class Player_User {
    constructor(config) {
        this.config = config; // this.config.limit = maximum time limit for user input = 0 no time limit
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

        this.bestAction = null;
        this.maxPlater = state.player;
        for ( let depth = 1; depth < this.config.maxDepth; depth++) 
        {
            this.currentMaxDepth = depth;
            try
            {
                this.alphaBeta(state, -Infinity, Infinity, 0, true);
                this.bestAction = this.currentBestAction;
            } catch (TimneoutException) {
                break; // exit the loop on timeout
            }
        }
        // return best action 
        return this.bestAction;
    }

    children(state) {
        let actions = state.getLegalActions();
        let children = [];
        for (let a of actions) {
            let child = state.copy();
            child.doAction(a);
            children.push( child );
        }
        return children;
    }


    // here we implement minmax without alha-beta pruning
    // make sure to copy states via state.copy() before generating children othewise modification of references of state will occur on different levels of recursion
    // ARgs:
    // state - state of current node of search tree
    // depth(int) : current depth of search
    // max(bool) : whether the player is maximizing or not
    MiniMax(state, depth, max) {
        // check if last node
        if (terminal(state) || depth == this.currentMaxDepth) { return eval(state, this.maxPlayer); }
        if (max) {
            let maxEval = -Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.minimax(child, depth + 1, !max);
                // could have done max(this.minimax(child, depth + 1, !max))
                if (evalPrime > maxEval) { maxEval = evalPrime;}
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.minimax(child, depth + 1, !max);
                // could have done min(this.minimax(child, depth + 1, !max))
                if (evalPrime < minEval) { minEval = evalPrime;}
            }
            return minEval;
        }
    }

    // here we implement the MIN MAX search with alpha-beta pruning
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
        // check if last node
        if (terminal(state) || depth == this.currentMaxDepth) { return eval(state, this.maxPlayer); }
        // perform time check
        let elapsedTime = performance.now() - this.searchStartTime;
        if (this.config.limit > 0 && elapsedTime > this.config.limit) { throw new TimneoutException(); }

        if (max) {
            let maxEval = -Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.alphaBeta(child, alpha, beta, depth + 1, !max);
                if (evalPrime > maxEval) { maxEval = evalPrime;}
                if (evalPrime > beta) { return maxEval; } // beta cutoff
                if (evalPrime > alpha)
                {
                    alpha = evalPrime;
                    if (depth == 0) { this.currentBestAction = child.lastAction; }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for ( let child in this.children(state)) {
                let evalPrime = this.alphaBeta(child, alpha, beta, depth + 1, !max);
                if (evalPrime < minEval) { minEval = evalPrime;}
                if (evalPrime < alpha) { return minEval; } // alpha cutoff
                if (evalPrime < beta) 
                {
                    beta = evalPrime; 
                }
            }
            return minEval;
        }
    }

    // here we implement the heuristic evaluation function for the state
    // returns large positive value for win for player, large negative value for loss for player, 0 for draw or no winner
    // be sure to pass player vairable into this function, call this with player = this.maxPlayer
    // Args:
    // state : state to evaluate
    // player(int) : player to evaluate the state for
    // Returns:
    // value(int) : heuristic evaluatiaon of the state

    eval(state, player) {

        let winner = state.winner();
        if (winner == player) { return 10000;} // win returns large
        else if (winner == (player + 1) % 2) {return -10000;} // return large negative for loss
        else if (winner == PLAYER_DRAW) { return 0;} // return 0 for draw
        else if (winner == PLAYER_NONE) { 
            // heuristic here goes between large negative and large positive
            return 0;
        }
    }


    // function to return zobrist hash value for the state
    // args:
    // state : state to get the hash value for
    // returns:
    // value(int) : zobrist hash value for the state
    getZobristHash(state) {
        // implement Zobrist hashing here
        return 0;
    }
}