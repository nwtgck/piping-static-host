export function hoge(str: string): number {
  return str.length;
}

import * as stream from 'stream';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import thenRequest, {ResponsePromise} from 'then-request';

const REALOAD_WAIT_SEC = 10;

// (from: https://stackoverflow.com/a/20100521/2885946)
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

function sleep(millis: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function pipingSend(serverUrl: string, deployId: string, filePath: string, body: stream.Readable): ResponsePromise {
  const u = url.resolve(serverUrl, path.join(deployId, filePath));
  console.log(`URL: ${u}`);
  return thenRequest('POST', u, {
    body: body,
  });
}

// def piping_send(server_url, deploy_id, file_path, body_f)
//   url = File.join(server_url, deploy_id, file_path)
//   puts("URL: #{url}")
//   uri = URI(url)
//   req = Net::HTTP::Post.new(uri.path)
//   req.body_stream = body_f
//   req.content_length = body_f.size
//   http = Net::HTTP.new(uri.host, uri.port)
//   if uri.scheme == "https"
//     http.use_ssl = true
//     http.verify_mode = OpenSSL::SSL::VERIFY_NONE
//   end
//   res = http.request(req)
//   res
// end

async function deployLoop(serverUrl: string, deployId: string, bodyFilePath: string, reqFilePath: string): Promise<void> {
  if (!fs.statSync(bodyFilePath).isFile()) {
    return;
  }
  while (true) {
    console.log(`Loading ${bodyFilePath} as ${reqFilePath}...`);
    try {
      const body = fs.createReadStream(bodyFilePath);
      const res = await pipingSend(serverUrl, deployId, reqFilePath, body);
      if (res.statusCode === 200) {
        console.log(`send status: ${res.statusCode}`);
      } else {
        await sleep(REALOAD_WAIT_SEC * 1000);
      }
    } catch (err) {
      console.error(err);
      await sleep(REALOAD_WAIT_SEC * 1000);
    }
  }
}

// def deploy_loop_thread(server_url, deploy_id, body_file_path, req_file_path)
//   if !File.file?(body_file_path)
//     return
//   end
//   Thread.start{
//     loop {
//       puts("Loading #{body_file_path} as #{req_file_path}...")
//       begin
//         open(body_file_path){|body_f|
//           res = piping_send(
//             server_url,
//             deploy_id,
//             req_file_path,
//             body_f
//           )
//           if res.code == "200"
//             puts("send status: #{res.code}")
//           else
//             sleep REALOAD_WAIT_SEC
//           end
//         }
//       rescue
//         p $!
//         sleep REALOAD_WAIT_SEC
//       end
//     }
//   }
// end

// def piping_deploy(server_url, deploy_id, public_dir_path, index_path=nil)
//   threads = []
//   if !index_path.nil?
//     # Enroll index
//     threads << deploy_loop_thread(server_url, deploy_id, index_path, "")
//     threads << deploy_loop_thread(server_url, deploy_id, index_path, "/")
//   end
//   fpaths = Dir.chdir(public_dir_path){
//     Dir.glob("**/*")
//   }
//   fpaths.each{|file_path|
//       joined_fpath = File.join(public_dir_path, file_path)
//       threads << deploy_loop_thread(
//         server_url,
//         deploy_id,
//         joined_fpath,
//         file_path
//       )
//     }
//   threads.each(&:join)
// end



const serverUrl      = "https://ppng.ml";
const deployId       = "mydeployid";


deployLoop(serverUrl, deployId, './README.md', '/');

// // const public_dir_path = "public_html"
// index_path      = "public_html/index.html" # NOTE: This can be nil
//
// piping_deploy(
//   server_url,
//   deploy_id,
//   public_dir_path,
//   index_path
// )

