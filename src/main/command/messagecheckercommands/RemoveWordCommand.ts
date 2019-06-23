import { Command } from "../Command";
import { Permissions, Message, RichEmbed } from "discord.js";
import { Server } from "../../storage/Server";
import { CommandResult } from "../classes/CommandResult";

export class RemoveWordCommand extends Command {
    static COMMAND_NAME = "removewords";
    static DESCRIPTION = "Remove word(s) from the blacklist.";
    static REMOVED_WORDS = "✅Removed Word(s)";
    static MAYBE_WORDS_NOT_INSIDE = "Perhaps those word(s) are not inside the list?";
    static UNABLE_TO_REMOVE_WORDS = "❌Unable To Remove";

    /** SaveServer: true, CheckMessage: false */
    private COMMAND_SUCCESSFUL_COMMANDRESULT: CommandResult = new CommandResult(true, false);
    private permissions = new Permissions(["KICK_MEMBERS", "BAN_MEMBERS"]);
    private args: string[];

    constructor(args: string[]) {
        super();
        this.args = args;
    }
    
    /**
     * This function executes the removeword command
     * Removes the words in the server's banned list array
     * 
     * @param  {Server} server Server object of the message
     * @param  {Message} message Message object from the bot's on message event
     * @returns CommandResult
     */
    public execute(server: Server, message: Message): CommandResult {
        //Check for permissions first
        if(!this.hasPermissions(this.permissions, message.member.permissions)) {
            return this.NO_PERMISSIONS_COMMANDRESULT;
        }

        //Execute
        let wordsRemoved: string[] = [];
        let wordsNotRemoved: string[] = [];
        this.changeServerSettings(server, wordsRemoved, wordsNotRemoved);

        //Generate output embed
        let embed = this.generateEmbed(wordsRemoved, wordsNotRemoved);

        //Send output
        message.channel.send(embed);
        return this.COMMAND_SUCCESSFUL_COMMANDRESULT;
    }

    /**
     * Generates output embed to be sent back to user.
     * 
     * @param  {string[]} wordsRemoved Words successfully removed
     * @param  {string[]} wordsNotRemoved Words unsuccessfully removed
     * @returns RichEmbed
     */
    public generateEmbed(wordsRemoved: string[],
                         wordsNotRemoved: string[]): RichEmbed {
        let embed = new RichEmbed().setColor(Command.EMBED_DEFAULT_COLOUR);
        let words = this.args;
        if(wordsRemoved.length !== 0) {
            let output = "";
            for(let i = 0; i < wordsRemoved.length; i++) {
                output += wordsRemoved[i];
                output += "\n";
            }
            embed.addField(RemoveWordCommand.REMOVED_WORDS, output, false);
        }

        if(wordsNotRemoved.length !== 0) {
            let output = ""
            for(let i = 0; i < wordsNotRemoved.length; i++) {
                output += wordsNotRemoved[i];
                output += "\n";
            }
            output += RemoveWordCommand.MAYBE_WORDS_NOT_INSIDE;
            embed.addField(RemoveWordCommand.UNABLE_TO_REMOVE_WORDS, output, false);
        }

        if(words.length === 0) {
            embed = new RichEmbed()
                .setColor(Command.EMBED_ERROR_COLOUR)
                .addField(Command.ERROR_EMBED_TITLE,
                          RemoveWordCommand.NO_ARGUMENTS);
        }

        return embed;
    }

    /**
     * Changed the settings of server object
     * 
     * @param  {Server} server the discord server
     * @param  {string[]} wordsRemoved Words successfully removed
     * @param  {string[]} wordsNotRemoved Words unsuccessfully removed
     * @returns void
     */
    public changeServerSettings(server: Server,
                                wordsRemoved: string[],
                                wordsNotRemoved: string[]): void {
        let words = this.args;
        for(let word of words) {
            // Make word lowercase
            word = word.toLowerCase();
            if(server.messageCheckerSettings.removeBannedWord(word)) {
                wordsRemoved.push(word);
            } else {
                wordsNotRemoved.push(word);
            }
        }
    }
}