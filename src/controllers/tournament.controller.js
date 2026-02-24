import { TournamentListingDTO } from "../dtos/tournament.dto.js";
import tournamentService from "../services/tournament.services.js";

const tournamentController = {
    create : async(req,res) =>{
        const tournament = await tournamentService.create(req.data, req.user.id);

         const dto = new TournamentListingDTO(tournament);
        res.status(201).json({data: dto})
    },
    delete: async(req,res)=>{
        const tournamentId = req.params.id;
        await tournamentService.delete(tournamentId, req.user);

        res.status(204).send()
    }
}

export default tournamentController