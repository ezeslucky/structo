import { ReactNode, Context } from "react";
import { UserElement, ClientReferenceElement } from "./element";

/** When encountering a class component this function can trigger a suspense */
export type Visitor = (
  element: UserElement,
  instance?: any
) => void | Promise<any>;

export type ClientReferenceVisitor = (
  element: ClientReferenceElement
) => void | ReactNode;
