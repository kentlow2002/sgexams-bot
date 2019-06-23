import { Command } from "../Command";
import { Permissions, Message, RichEmbed } from "discord.js";
import { Server } from "../../storage/Server";
import { CommandResult } from "../classes/CommandResult";

export class ListWordsCommand extends Command {
    static COMMAND_NAME = "listwords";
    static DESCRIPTION = "Displays all blacklisted words.";
    static NO_WORDS_FOUND = "There are no words set for this server!";
    static EMBED_TITLE = "Blacklisted Words";

    /** SaveServer: false, CheckMessage: true */
    private COMMAND_SUCCESSFUL_COMMANDRESULT: CommandResult = new CommandResult(false, true);
    private permissions = new Permissions(["KICK_MEMBERS", "BAN_MEMBERS"]);

    /**
     * This function executes the list words command.
     * Lists out all the banned words that the server has.
     * 
     * @param  {Server} server
     * @param  {Message} message
     * @returns CommandResult
     */
    public execute(server: Server, message: Message): CommandResult {
        //Check for permissions first
        if(!this.hasPermissions(this.permissions, message.member.permissions)) {
            return this.NO_PERMISSIONS_COMMANDRESULT;
        }

        //Execute Command
        message.channel.send(this.generateEmbed(server));
        return this.COMMAND_SUCCESSFUL_COMMANDRESULT;
    }
    
    /**
     * Generates embed that is sent back to user
     * 
     * @param  {Server} server
     * @returns RichEmbed
     */
    public generateEmbed(server: Server): RichEmbed {
        let bannedWords = server.messageCheckerSettings.getBannedWords();
        bannedWords.sort();

        let embed = new RichEmbed().setColor(Command.EMBED_DEFAULT_COLOUR);
        if(bannedWords.length === 0) {
            embed.addField(ListWordsCommand.EMBED_TITLE, ListWordsCommand.NO_WORDS_FOUND);
        } else {
            let output = "";
            for(let word of bannedWords) {
                output += word + "\n";
            }
            embed.setColor(Command.EMBED_DEFAULT_COLOUR);
            embed.addField(ListWordsCommand.EMBED_TITLE, output);
        }
        return embed;
    }

    public changeServerSettings(server: Server, ...args: any): void {
        throw new Error(Command.THIS_METHOD_SHOULD_NOT_BE_CALLED);
    }
}