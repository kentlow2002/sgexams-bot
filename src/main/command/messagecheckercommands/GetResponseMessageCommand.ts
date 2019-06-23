import { Command } from "../Command";
import { Permissions, Message, RichEmbed } from "discord.js";
import { Server } from "../../storage/Server";
import { CommandResult } from "../classes/CommandResult";

export class GetResponseMessageCommand extends Command {
    static COMMAND_NAME = "getresponsemessage";
    static DESCRIPTION = "Displays the response message to the user upon detection of blacklisted words for this server.";
    static CHANNEL_NOT_SET = "There is no message set for this server.";
    static EMBED_TITLE = "Response Message"

    /** SaveServer: false, CheckMessage: true */
    private COMMAND_SUCCESSFUL_COMMANDRESULT: CommandResult = new CommandResult(false, true);
    private permissions = new Permissions(["KICK_MEMBERS", "BAN_MEMBERS"]);


    constructor() {
        super();
    }

    /**
     * This function executes the setchannel command
     * Sets the reporting channel of the server.
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
        let responseMessage = server.messageCheckerSettings.getResponseMessage();
        let embed = new RichEmbed().setColor(Command.EMBED_DEFAULT_COLOUR);
        if(typeof responseMessage === "undefined") {
            embed.addField(GetResponseMessageCommand.EMBED_TITLE,
                           GetResponseMessageCommand.CHANNEL_NOT_SET);
        } else {
            let msg = `Response message is ${responseMessage}.`;
            embed.addField(GetResponseMessageCommand.EMBED_TITLE, msg);
        }
        return embed;
    }

    public changeServerSettings(server: Server, ...args: any): void {
        throw new Error(Command.THIS_METHOD_SHOULD_NOT_BE_CALLED);
    }
}