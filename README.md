# Ludo
A 4 player ludo game that supports multiple rules involved in the actual board game.

The game supports the following rules :
1. A player can take a piece out of the base only if he gets a 6 in the dice.
2. The first player to place all of his pieces in the home wins.
3. Multiple pieces of different players can reside safely on a star cell.
4. A player cannot eliminate his own piece.
5. If there are multiple pieces of different players on a cell, a player placing his piece on this cell can eliminate 1 piece of the last player who rolled the dice. Example :
     a. If a cell has 2 pieces of player 1 and player 2 puts one of his pieces in the same cell, player 2 eliminates 1 piece of player 1. So now in this cell there will be 1 piece of player 1 and 1 piece of player 2
     b. Now if player 3 (or 4) put 1 piece in this cell, he will eliminate 1 piece of player 2 as he is the one (among player 1 and 2) who has last rolled the dice
6. A player will get extra moves on every 6 in dice, on eliminating a piece of another player and on placing a piece in home.
