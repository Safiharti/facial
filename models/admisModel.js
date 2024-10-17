module.exports = (sequelize, DataTypes) => {
    const Admis = sequelize.define("admis", {
        admis_nom : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        admis_prenom : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        admis_tel : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        admis_mail : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        admis_parcours : {
            type : DataTypes.STRING,
            allowNull : false,
        }
    })

    return Admis
}