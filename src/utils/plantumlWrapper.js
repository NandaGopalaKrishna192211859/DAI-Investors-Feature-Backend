export function wrapUML(body) {
  return `
@startuml

${body}

@enduml
`;
}
