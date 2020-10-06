module.exports = {
    age:  function (timestamp) {
        const today = new Date() // Pegando a data atual
        const birthDate = new Date(timestamp) // Pegando o timestamp

        //pegando idadaAtual com subtraindo anoAtual - anoAniversario
        let age = today.getFullYear() - birthDate.getFullYear()
        // Pegando mesAniversario subtraindo mesAtual - mesAniversario
        const month = today.getMonth() - birthDate.getMonth()

        //Se Mês é menor que Zero ou Mês igual a ZERO E DataAtual menor que DataAniversario
        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }

        return age // Retorna Idade
    },
    graduation: function (escolaridade) {      
        if (escolaridade == "MC") graduation = "Médio"
        if (escolaridade == "SC") graduation = "Superior"
        if (escolaridade == "MD") graduation = "Mestrado e Doutorado"       

        return graduation

    },
    date: function (timestamp) {        
            // Criando um novo objeto de data com o valor que vem no timestamp
            const date = new Date(timestamp)
            // yyyy
            const year = date.getUTCFullYear()
            // mm sabendo que o 0 é Janeiro e 11 é Dezembro color +1
            const month = `0${date.getUTCMonth() + 1}`.slice(-2)	//usando SLICE
            // dd
            const day = `0${date.getUTCDate()}`.slice(-2) //usando SLICE

            return `${year}-${month}-${day}`
    }
}