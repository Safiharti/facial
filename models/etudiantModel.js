module.exports = (sequelize, DataTypes) => {
    const Etudiant = sequelize.define("etudiant", {
        etudiant_matricule: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
        },
        etudiant_nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_tel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_mail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_parcours: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_niveau: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_date_naissance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_lieu_naissance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_cin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_bordereau: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_annee: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_photo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        etudiant_etat: {
            type: DataTypes.STRING,
            defaultValue: 'invalide',
            allowNull: false,
        },
    });

    return Etudiant;
};
