import sequelize from './config.js';

import User from './entities/user.entity.js';
import Tournament from './entities/tournament.entity.js';
import Match from './entities/match.entity.js';
import Category from './entities/category.entity.js';

// Tournament organized by a user
Tournament.belongsTo(User, {
	as: 'organizer',
	foreignKey: {
		allowNull: false,
		name: 'organizerId',
	},
});

//user organize multiple Tournament

User.hasMany(Tournament, {
	as: 'tournaments',
	foreignKey: 'organizerId',
});
/*-------------------------------------*/
User.belongsToMany(Tournament, {
	through: 'User_Participate_Tournament',
	as: 'participate',
	foreignKey: 'userId',
	otherKey: 'tournamentId',
});
Tournament.belongsToMany(User, {
	through: 'User_Participate_Tournament',
	as: 'participate',
	foreignKey: 'tournamentId',
	otherKey: 'userId',
});
/*-------------------------------------*/
Match.belongsTo(User, {
  as: 'whitePlayer',
  foreignKey: {
    name: 'whitePlayerId',
    allowNull: false,
  },
});


User.hasMany(Match, {
  as: 'whiteMatches',
  foreignKey: 'whitePlayerId',
});
/*-------------------------------------*/

Match.belongsTo(User, {
  as: 'blackPlayer',
  foreignKey: {
    name: 'blackPlayerId',
    allowNull: false,
  },
});

User.hasMany(Match, {
  as: 'blackMatches',
  foreignKey: 'blackPlayerId',
});

/*-------------------------------------*/
Match.belongsTo(Tournament, {
  as: 'tournament',
  foreignKey: {
    name: 'tournamentId',
    allowNull: false,
  },
});

Tournament.hasMany(Match, {
  as: 'matches',
  foreignKey: 'tournamentId',
});
/*-------------------------------------*/

Tournament.belongsToMany(Category, {
  through: 'can_participate',
  foreignKey: 'tournamentId',
  otherKey: 'categoryId',
  as: 'categories',
});

Category.belongsToMany(Tournament, {
  through: 'can_participate',
  foreignKey: 'categoryId',
  otherKey: 'tournamentId',
  as: 'tournaments',
});

export default {
    sequelize,
    User,
    Tournament,
    Match,
    Category,
}