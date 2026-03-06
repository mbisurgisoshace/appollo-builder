import {
  Klass,
  TextNode,
  LexicalNode,
  ParagraphNode,
  LexicalNodeReplacement,
} from "lexical";
import { OverflowNode } from "@lexical/overflow";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

import { ImageNode } from "@/components/rich-text-editor/nodes/image-node";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    OverflowNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    ImageNode,
    TableNode,
    TableRowNode,
    TableCellNode,
  ];
