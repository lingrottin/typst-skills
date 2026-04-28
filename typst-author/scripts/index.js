import { tex2typst } from 'tex2typst';

const args = process.argv.slice(2).join(" ");

console.log(tex2typst(args))
