import { Command } from "../Command";
import { Permissions, Message, RichEmbed } from "discord.js";
import { Server } from "../../storage/Server";
import { CommandResult } from "../classes/CommandResult";
import { CommandParser } from "../CommandParser";

export class ListCommandsCommand extends Command {
    static COMMAND_NAME = "help";
    static DESCRIPTION = "Displays all the available commands that this bot listens to.";
    static EMBED_TITLE = "Commands";
    
    /** SaveServer: false, CheckMessage: true */
    private COMMAND_SUCCESSFUL_COMMANDRESULT: CommandResult = new CommandResult(false, true);
    private permissions = new Permissions(["KICK_MEMBERS", "BAN_MEMBERS"]);
    private commands: string[];
    private descriptions: string[];

    /**
     * @param  {Set<string>} commands List of available commands
     * @param  {string[]} descriptions List of descriptions
     */
    constructor() {
        super();
        this.commands = Array.from(CommandParser.commands);
        this.descriptions = CommandParser.descriptions;
    }

    /**
     * This function lists out the commands that the bot will respond to.
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

        //Generate embed and send
        message.channel.send(this.generateEmbed());
        return this.COMMAND_SUCCESSFUL_COMMANDRESULT;
    }
    
    /**
     * Generates embed to be sent back to user.
     * 
     * @returns RichEmbed
     */
    public generateEmbed(): RichEmbed {
        let output = "";
        for(let i in this.commands) {
            output += `**${this.commands[i]}**` 
            output += (this.descriptions[i] === "\u200b") ?
                      "\n" : ` - ${this.descriptions[i]}\n`;
        }
        let embed = new RichEmbed();
        embed.setColor(Command.EMBED_DEFAULT_COLOUR);
        embed.addField(ListCommandsCommand.EMBED_TITLE, output);
        return embed;
    }

    public changeServerSettings(server: Server, ...args: any): void {
        throw new Error(Command.THIS_METHOD_SHOULD_NOT_BE_CALLED);
    }
}