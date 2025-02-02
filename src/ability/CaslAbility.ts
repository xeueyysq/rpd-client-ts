import { AbilityBuilder, Ability, AbilityClass } from "@casl/ability";

type Actions = "get" | "edit";
type Subjects =
  | "auth"
  | "lk"
  | "rop_interface"
  | "teacher_interface"
  | "change_templates"
  | "competencies"
  | "rpd_template";
export type UserRole = "anonymous" | "teacher" | "rop" | "admin";

export type AppAbility = Ability<[Actions, Subjects]>;
const AppAbilityClass = Ability as AbilityClass<AppAbility>;

const defineRulesFor = (role: UserRole) => {
  const { can, rules } = new AbilityBuilder(AppAbilityClass);

  if (role === "anonymous") {
    can("get", "auth");
  }
  if (role === "teacher") {
    can("get", "teacher_interface");
    can("get", "lk");
    can("edit", "competencies");
  } else if (role === "rop") {
    can("get", "rop_interface");
    can("get", "lk");
  } else if (role === "admin") {
    can("get", "change_templates");
    can("get", "lk");
    can("get", "rpd_template");
    can("edit", "rpd_template");
  }

  return rules;
};

export const buildAbilityFor = (role: UserRole): AppAbility => {
  return new AppAbilityClass(defineRulesFor(role), {});
};
