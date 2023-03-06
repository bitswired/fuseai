import format from "string-template";
function matchGroups(str: string, regexp: RegExp) {
  const matches = str.match(regexp);

  if (!matches) {
    return null;
  }

  const groups: string[][] = [];
  matches.forEach((match) => {
    const groupMatches = match.match(regexp);
    if (!groupMatches) throw new Error("No group matches found");
    groups.push(groupMatches.slice(1));
  });

  return groups;
}

export function getTemplateVariablesRegex(str: string) {
  const myRegex = /{\s*(.*?)\s*}/g;
  const res = matchGroups(str, myRegex);
  if (!res) return null;

  const variableNames = [];

  let matches;
  while ((matches = myRegex.exec(str))) {
    variableNames.push(matches[1]);
  }

  return variableNames;
}

export function replaceTemplate(template: string, variables: any) {
  const res = format(template, variables);
  return res;
}

export function getTemplateVariablesAsObject(str: string) {
  const myRegex = /{\s*(.*?)\s*}/g;
  const res = matchGroups(str, myRegex);
  if (!res) return null;

  const variableNames = [];

  let matches;
  while ((matches = myRegex.exec(str))) {
    variableNames.push(matches[1]);
  }

  const obj: Record<string, string> = {};

  variableNames.forEach((x) => {
    if (!x) throw new Error("No variable name found");
    obj[x] = "";
  });

  return obj;
}
