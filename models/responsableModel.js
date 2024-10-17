module.exports = (sequelize, DataTypes) => {
    const Responsable = sequelize.define("responsable", {
        responsable_nom : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        responsable_prenom : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        responsable_tel : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        responsable_mail : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        responsable_mdp : {
            type : DataTypes.STRING,
            allowNull : false,
        }
    })

    return Responsable
}