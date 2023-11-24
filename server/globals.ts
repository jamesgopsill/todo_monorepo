import { Static, Type } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import { existsSync, readFileSync } from "fs"

export const GlobalVars = Type.Object(
	{
		DB_FILE: Type.String(),
		JWT_SECRET: Type.String(),
	},
	{
		additionalProperties: false,
	},
)
export type GlobalVars = Static<typeof GlobalVars>

export let globalVars: GlobalVars = {
	DB_FILE: "",
	JWT_SECRET: "",
}

if (!existsSync("config.json")) {
	console.error("Could not find config.json")
	process.exit()
}

const data = JSON.parse(readFileSync("config.json").toString())
if (!Value.Check(GlobalVars, data)) {
	console.log([...Value.Errors(GlobalVars, data)])
	process.exit()
}

globalVars = data
