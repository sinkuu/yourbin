import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
// import "./index.css";
import "codemirror/mode/apl/apl";
import "codemirror/mode/asciiarmor/asciiarmor";
import "codemirror/mode/asn.1/asn.1";
import "codemirror/mode/asterisk/asterisk";
import "codemirror/mode/brainfuck/brainfuck";
import "codemirror/mode/clike/clike";
import "codemirror/mode/clojure/clojure";
import "codemirror/mode/cmake/cmake";
import "codemirror/mode/cobol/cobol";
import "codemirror/mode/coffeescript/coffeescript";
import "codemirror/mode/commonlisp/commonlisp";
import "codemirror/mode/crystal/crystal";
import "codemirror/mode/css/css";
import "codemirror/mode/cypher/cypher";
import "codemirror/mode/d/d";
import "codemirror/mode/dart/dart";
import "codemirror/mode/diff/diff";
import "codemirror/mode/django/django";
import "codemirror/mode/dockerfile/dockerfile";
import "codemirror/mode/dtd/dtd";
import "codemirror/mode/dylan/dylan";
import "codemirror/mode/ebnf/ebnf";
import "codemirror/mode/ecl/ecl";
import "codemirror/mode/eiffel/eiffel";
import "codemirror/mode/elm/elm";
import "codemirror/mode/erlang/erlang";
import "codemirror/mode/factor/factor";
import "codemirror/mode/fcl/fcl";
import "codemirror/mode/forth/forth";
import "codemirror/mode/fortran/fortran";
import "codemirror/mode/gas/gas";
import "codemirror/mode/gfm/gfm";
import "codemirror/mode/gherkin/gherkin";
import "codemirror/mode/go/go";
import "codemirror/mode/groovy/groovy";
import "codemirror/mode/haml/haml";
import "codemirror/mode/handlebars/handlebars";
import "codemirror/mode/haskell/haskell";
import "codemirror/mode/haskell-literate/haskell-literate";
import "codemirror/mode/haxe/haxe";
import "codemirror/mode/htmlembedded/htmlembedded";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/http/http";
import "codemirror/mode/idl/idl";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jinja2/jinja2";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/julia/julia";
import "codemirror/mode/livescript/livescript";
import "codemirror/mode/lua/lua";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/mathematica/mathematica";
import "codemirror/mode/mbox/mbox";
import "codemirror/mode/mirc/mirc";
import "codemirror/mode/mllike/mllike";
import "codemirror/mode/modelica/modelica";
import "codemirror/mode/mscgen/mscgen";
import "codemirror/mode/mumps/mumps";
import "codemirror/mode/nginx/nginx";
import "codemirror/mode/nsis/nsis";
import "codemirror/mode/ntriples/ntriples";
import "codemirror/mode/octave/octave";
import "codemirror/mode/oz/oz";
import "codemirror/mode/pascal/pascal";
import "codemirror/mode/pegjs/pegjs";
import "codemirror/mode/perl/perl";
import "codemirror/mode/php/php";
import "codemirror/mode/pig/pig";
import "codemirror/mode/powershell/powershell";
import "codemirror/mode/properties/properties";
import "codemirror/mode/protobuf/protobuf";
import "codemirror/mode/pug/pug";
import "codemirror/mode/puppet/puppet";
import "codemirror/mode/python/python";
import "codemirror/mode/q/q";
import "codemirror/mode/r/r";
import "codemirror/mode/rpm/rpm";
import "codemirror/mode/rst/rst";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/rust/rust";
import "codemirror/mode/sas/sas";
import "codemirror/mode/sass/sass";
import "codemirror/mode/scheme/scheme";
import "codemirror/mode/shell/shell";
import "codemirror/mode/sieve/sieve";
import "codemirror/mode/slim/slim";
import "codemirror/mode/smalltalk/smalltalk";
import "codemirror/mode/smarty/smarty";
import "codemirror/mode/solr/solr";
import "codemirror/mode/soy/soy";
import "codemirror/mode/sparql/sparql";
import "codemirror/mode/spreadsheet/spreadsheet";
import "codemirror/mode/sql/sql";
import "codemirror/mode/stex/stex";
import "codemirror/mode/stylus/stylus";
import "codemirror/mode/swift/swift";
import "codemirror/mode/tcl/tcl";
import "codemirror/mode/textile/textile";
import "codemirror/mode/tiddlywiki/tiddlywiki";
import "codemirror/mode/tiki/tiki";
import "codemirror/mode/toml/toml";
import "codemirror/mode/tornado/tornado";
import "codemirror/mode/troff/troff";
import "codemirror/mode/ttcn/ttcn";
import "codemirror/mode/ttcn-cfg/ttcn-cfg";
import "codemirror/mode/turtle/turtle";
import "codemirror/mode/twig/twig";
import "codemirror/mode/vb/vb";
import "codemirror/mode/vbscript/vbscript";
import "codemirror/mode/velocity/velocity";
import "codemirror/mode/verilog/verilog";
import "codemirror/mode/vhdl/vhdl";
import "codemirror/mode/vue/vue";
import "codemirror/mode/webidl/webidl";
import "codemirror/mode/xml/xml";
import "codemirror/mode/xquery/xquery";
import "codemirror/mode/yacas/yacas";
import "codemirror/mode/yaml/yaml";
import "codemirror/mode/yaml-frontmatter/yaml-frontmatter";
import "codemirror/mode/z80/z80";

interface EditorState {
  codemirror: CodeMirror.EditorFromTextArea | null;
}

const Editor = (props: any) => {
  let [state, setState] = useState<EditorState>({
    codemirror: null
  });
  const textarea = useRef<HTMLTextAreaElement>(null);

  const { onChange, editor } = props;

  const changesHandler = useCallback((inst: any) => {
    onChange(inst.getValue());
  }, [onChange]);

  useEffect(() => {
    const codemirror = CodeMirror.fromTextArea(textarea.current!, {
      lineNumbers: true
    });

    codemirror.on("changes", changesHandler);

    setState({ codemirror });

    return () => {
      codemirror.toTextArea();
    };
  }, [changesHandler]);

  const { type, content, indent } = editor;

  useEffect(() => {
    const { codemirror } = state;
    if (codemirror && codemirror.getValue() === "") {
      codemirror.off("changes", changesHandler);
      codemirror.setValue(content);
      codemirror.on("changes", changesHandler);
    }
  }, [state, content, changesHandler]);

  useEffect(() => {
    const { codemirror } = state;
    if (codemirror) {
      codemirror.setOption("mode", type);
    }
  }, [state, type]);

  useEffect(() => {
    const { codemirror } = state;
    if (codemirror) {
      codemirror.setOption("indentUnit", indent.size);
      codemirror.setOption("tabSize", indent.size);
      if (indent.mode === "space") {
        codemirror.setOption("extraKeys", {
          Tab: cm => {
            cm.replaceSelection(" ".repeat(indent.size));
          }
        });
      } else {
        codemirror.setOption("extraKeys", {});
      }
    }
  }, [state, indent]);

  return <textarea ref={textarea}></textarea>;
};

export default Editor;
